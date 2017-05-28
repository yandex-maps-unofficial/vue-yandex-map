<template>
    <span></span>
</template>

<script>
    export default {
        props: ['latitude', 'longtitude'],
        mounted() {
	        console.log(this.latitude);
        }
    }
</script>