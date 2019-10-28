import { mount } from '@vue/test-utils';
import { yandexMap, ymapMarker } from '../src';

describe('Component', () => {
  const wrapper = mount(yandexMap, {
    propsData: {
      coords: [1, 1]
    }
  });

  test('Map is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });

  test('Map is rendered', () => {
    expect(wrapper.contains('.ymap-container')).toBe(true);
  });
});
