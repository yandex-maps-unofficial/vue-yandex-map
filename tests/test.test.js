import { mount } from '@vue/test-utils';
import { yandexMap } from '../src';

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(yandexMap, {
      propsData: {
        coords: [1, 1]
      }
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
