export const componentsConfig = [
    {
        tag: "empty-test",
        config: [
            {
                title: "section 1",
                items: [
                    { tag: "input", type: "range", min: 0, max: 100, value: 75, label: "size" },
                    { tag: "input", type: "range", min: 0, max: 50, value: 50, label: "size" },
                ]
            },
            {
                title: "section 2",
                items: [
                    { tag: "input", type: "range", min: 20, max: 100, value: 20, label: "Cells size" },
                    { tag: "input", type: "range", min: 0, max: 50, value: 50, label: "dddd" },
                ]
            }]
    },
    {
        tag: "matrix-effect",
        config: [
            {
                title: "Visual Parameters",
                items: [
                    { tag: "input", type: "range", min: 20, max: 100, value: 20, label: "Cells size" },
                    { tag: "input", type: "range", min: 0, max: 50, value: 50, label: "dddd" },
                ]
            }]
    },
]