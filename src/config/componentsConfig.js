export const componentsConfig = [
    {
        tag: "empty-test",
        config: [
            {
                title: "section 1",
                items: [
                    { event: "test1", tag: "input", type: "range", min: 0, max: 100, value: 75, label: "test1" },
                    { event: "test2", tag: "input", type: "range", min: 0, max: 50, value: 50, label: "test2" },
                ]
            },
            {
                title: "section 2",
                items: [
                    { event: "test3", tag: "input", type: "range", min: 20, max: 100, value: 20, label: "test3" },
                    { event: "test4", tag: "input", type: "range", min: 0, max: 50, value: 50, label: "test4" },
                ]
            }]
    },
    {
        tag: "matrix-effect",
        config: [
            {
                title: "Visual Parameters",
                items: [
                    { event: "cellSize", tag: "input", type: "range", min: 20, max: 100, value: 20, label: "Cell size" },
                    { event: "symbolSize", tag: "input", type: "range", min: 0, max: 50, value: 50, label: "Symbol size" },
                ]
            }]
    },
]