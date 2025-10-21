export const componentsConfig = [
    {
        tag: "empty-component",
        config: [
            {
                title: "section 1",
                items: [
                    { event: "test1", type: "range", min: 0, max: 100, value: 75, label: "test1" },
                    { event: "test2", type: "switch", value: true, label: "test2" },
                ]
            },
            {
                title: "section 2",
                items: [
                    { event: "test3", type: "colorPickerRGB", value: false, label: "test3 color" },
                ]
            }]
    },
    {
        tag: "matrix-effect",
        config: [
            {
                title: "Visual Parameters",
                items: [
                    { event: "size", type: "range", min: 20, max: 100, value: 20, label: "Cell size" },
                    { event: "interval", type: "range", min: 80, max: 1000, value: 80, label: "Column interval" },
                    { event: "steps", type: "range", min: 0, max: 200, value: 50, label: "Cell interval" },
                    { event: "direction", type: "switch", value: true, label: "Direction effect" },

                ]
            }]
    },
]