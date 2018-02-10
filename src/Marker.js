import { compareValues, emitter } from './utils';

export default {
    data: () => ({
        ymapEventBus: emitter,
        unwatchArr: []
    }),
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
        balloonTemplate: String,
        markerId: {
            type: [String, Number],
            required: true
        },
        properties: Object,
        options: Object
    },
    render() {
    },
    mounted() {
        for (let prop in this.$props) {
            this.unwatchArr.push(this.$watch(prop, (newVal, oldVal) => compareValues(newVal, oldVal, this.ymapEventBus)));
        }
    },
    beforeDestroy() {
        this.unwatchArr.forEach(f => f());
    }
}
