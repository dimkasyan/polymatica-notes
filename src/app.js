import { templateJSengine } from './templateJSengine';
import { layoutRowsNote } from './layoutRowsNote';

const popup = document.querySelector('.popup__overlay');
const addBtnPopup = document.querySelector('.add-btn');
const close = document.querySelector('.close');
const months = document.querySelectorAll('.month-box');
const notesContent = document.querySelector('.notes-content');
const addBtnNote = popup.querySelector('.add-note');
const deleteBtnNote = document.querySelector('.delete-btn');
const pagination = document.querySelector('#pagination');
const nextSteps = document.querySelector('.next-steps');
const nextStep = document.querySelector('.next-step');
const endStep = document.querySelector('.end-step');

const listMonths = Array.from(months).map(month => month.dataset.month).reduce((result, item) => {
  result[item] = [];
  return result;
}, {});

const notesOnPage = 10;
let numberActivePage = null;
let currentMonth = null;

function drawingLinesNote(shortMonth, isUpdatePagination = false, isAdd = true) {
  if(!!JSON.parse(localStorage.getItem(shortMonth))) {
    listMonths[shortMonth] = JSON.parse(localStorage.getItem(shortMonth));
  }

  const monthStorage = listMonths[shortMonth];

  const countOfItems = Math.ceil(listMonths[shortMonth].length / notesOnPage);

  if(isUpdatePagination) {
    numberActivePage = !!document.querySelector('li.active') ? +document.querySelector('li.active').innerText : 1;
    const paginationItems = Array.from(pagination.childNodes);
    paginationItems.forEach(item => {
      item.remove();
    })
  }

  const showPage = (function() {
    let active;

    return function(item) {
      if (active) {
        active.classList.remove('active');
      }
      active = item;

      item.classList.add('active');

      let pageNum = +item.innerText;

      let start = (pageNum - 1) * notesOnPage;
      let end = start + notesOnPage;
      let notes = monthStorage.slice(start, end);

      const tableFormNotesNodes = Array.from(notesContent.childNodes);

      if(tableFormNotesNodes.length !== 0) {
        tableFormNotesNodes.forEach(child => {
            child.remove();
        });
      }

      notes.forEach(note => {
        notesContent.append(templateJSengine(layoutRowsNote(note)))
      })

      notesContent.querySelectorAll('.note-row').forEach(note => {
        note.addEventListener('click', (event) => selectedNote(event))
      })
    };
  }());

  const items = [];
  for (let i = 1; i <= countOfItems; i++) {
    const li = document.createElement('li');
    li.innerText = i;
    pagination.appendChild(li);
    items.push(li);
  }

  if (items.length >= 2) {
    nextSteps.classList.add('show');
  } else {
    if(nextSteps.classList.contains('show')) {
      nextSteps.classList.remove('show');
    }
  }

  if(items.length === 0) {
    return;
  }

  if(!isUpdatePagination) {
    showPage(items[0]);
  } else {
    if(currentMonth !== shortMonth) {
      numberActivePage = 1;
    }
    if(isAdd) {
      numberActivePage = items.length;
    }
    console.log(numberActivePage);
    showPage(items[numberActivePage - 1]);
  }
  for (let item of items) {
    item.addEventListener('click', function() {
      showPage(this);
    });
  }

  if(nextSteps.classList.contains('show')) {
    nextStep.addEventListener('click', () => {
      numberActivePage = +document.querySelector('li.active').innerText - 1;
      showPage(items[numberActivePage + 1]);
    });
    endStep.addEventListener('click', () => showPage(items[items.length - 1]));
  }
}

function addNote(popup) {
  const dateTime = popup.querySelector('#date');
  const title = popup.querySelector('#title');
  const note = popup.querySelector('#note');

  const shortMonth = new Date(dateTime.value).toLocaleString('en-US', {
    month: 'short'
  });

  if(currentMonth === null) {
    currentMonth = shortMonth;
  }

  const dateTimeValue = new Date(dateTime.value).toLocaleString();

  const noteObject = {
    id: `note-id-${dateTime.value + Math.random(10)}`,
    dateTime: dateTimeValue,
    title: title.value,
    note: note.value,
  }

  if(dateTime.value === '' || title.value === '' || note.value === '') {
    return;
   }

  const monthStorage = JSON.parse(localStorage.getItem(shortMonth));

  if(!!monthStorage) {
    const storageNote = JSON.stringify([...monthStorage, noteObject])
    localStorage.setItem(shortMonth, storageNote);
    listMonths[shortMonth] = [...monthStorage, noteObject];
  } else {
    localStorage.setItem(shortMonth, JSON.stringify([noteObject]));
    listMonths[shortMonth] = [noteObject];
  }

  popup.classList.add("hidden");
  dateTime.value = '';
  title.value = '';
  note.value = '';

  months.forEach(item => {
    if(item.classList.contains('selected')) {
      item.classList.remove('selected');
    }
    if(item.dataset.month === shortMonth) {
      item.classList.add('selected');

      const tableFormNotesNodes = Array.from(notesContent.childNodes);

      if(tableFormNotesNodes.length !== 0) {
        tableFormNotesNodes.forEach(child => {
            child.remove()
        });
      }
      drawingLinesNote(shortMonth, true);
    }
  })
}

function selectedNote(event) {
  const noteRow = notesContent.querySelectorAll('.note-row');
  noteRow.forEach(note => {
    if(note.classList.contains('selected')) {
      note.classList.remove('selected');
    }
  })
  event.currentTarget.classList.add('selected');
}

addBtnPopup.addEventListener("click", event => {
    event.preventDefault();
    popup.classList.remove("hidden");
});

addBtnNote.addEventListener("click", () => addNote(popup));

popup.addEventListener("click", event => {
  event = event || window.event;
  if (event.target === this) {
    popup.classList.add("hidden");
  }
});

close.addEventListener("click", event => {
    event.preventDefault();
    popup.classList.add("hidden");
});

deleteBtnNote.addEventListener('click', () => {
  const noteRow = notesContent.querySelectorAll('.note-row');
  noteRow.forEach(note => {
    if(note.classList.contains('selected')) {
      const currentMonth = document.querySelector('.month-box.selected').dataset.month;
      listMonths[currentMonth] = listMonths[currentMonth].filter(month => month.id !== note.getAttribute('id'));
      localStorage.setItem(currentMonth, JSON.stringify(listMonths[currentMonth]));
      const tableFormNotesNodes = Array.from(notesContent.childNodes);

      if(tableFormNotesNodes.length !== 0) {
        tableFormNotesNodes.forEach(child => {
            child.remove();
        });
      }

      drawingLinesNote(currentMonth, true, false);
    }
  })
});

months.forEach(month => {
  month.addEventListener("click", event => {
    if (event.target === this) {
      return;
    }
    months.forEach(item => {
      if(item.classList.contains('selected')) {
        item.classList.remove('selected');
      }
    })

    const tableFormNotesNodes = Array.from(notesContent.childNodes);
    const paginationItems = Array.from(pagination.childNodes);

    if(tableFormNotesNodes.length !== 0 && paginationItems.length !== 0) {
      tableFormNotesNodes.forEach(child => {
          child.remove()
      });
      paginationItems.forEach(item => {
        item.remove();
      })
    }

    if(currentMonth === null || currentMonth !== event.target.dataset.month) {
      currentMonth = event.target.dataset.month;
    }

    if(!!localStorage.getItem(event.target.dataset.month)) {
      drawingLinesNote(event.target.dataset.month);
    }

    event.target.classList.add('selected');
  })
})
