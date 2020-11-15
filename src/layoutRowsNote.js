export const layoutRowsNote = item => {
    return {
        tag: `div`,
        cls: [`note-row`],
        attrs: {
            id: item.id
        },
        content: [
            {
                tag: `div`,
                cls: `note-date-time`,
                content: `${item.dateTime}`
            },
            {
                tag: `div`,
                cls: `note-title`,
                content: `${item.title}`
            },
            {
                tag: `div`,
                cls: `note-description`,
                content: `${item.note}`
            },
        ]
    }
}
