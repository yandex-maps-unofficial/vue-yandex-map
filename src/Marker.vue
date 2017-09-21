<script>
    export default {
        props: {
            coords: {
                type: Array,
                required: true
            },
            hintContent: String,
            icon: Object,
            balloon: Object,
            markerType: {
                type: String,
                required: true
            },
            markerFill: Object,
            markerStroke: Object,
            clusterName: String,
            circleRadius: {
                validator(val) {
                    return !isNaN(val)
                },
                default: 1000
            },
            callbacks: Object,
            data: Object
        },
        render() {
        }
    }
</script>
