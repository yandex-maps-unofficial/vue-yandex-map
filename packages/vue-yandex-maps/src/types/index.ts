import { GenericEntity, GenericRootEntity } from '@yandex/ymaps3-types/imperative/Entities';

export interface YMapComplexOptions<Root extends GenericRootEntity<unknown> = GenericRootEntity<unknown>> {
    children?: GenericEntity<unknown, {}, Root>[];
    container?: boolean;
}
