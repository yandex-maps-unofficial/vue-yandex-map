import * as utils from './utils';

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
        data: Object,
        balloonTemplate: String
    },
    render() {
    },
    mounted() {
        for (let prop in this.$props) {
            this.$watch(prop, (newVal, oldVal) => utils.compareValues(newVal, oldVal, this.$ymapEventBus));    
        }
    }
}
