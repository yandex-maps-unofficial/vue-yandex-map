declare module '*.vue' {
    import { DefineComponent } from 'vue-demi';

    const component: DefineComponent<{}, {}, any>;
    export default component;
}
