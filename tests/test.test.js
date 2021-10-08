/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils';
import { yandexMap, ymapMarker } from '../src';

describe('Component', () => {
  const wrapper = mount(yandexMap, {
    props: {
      coords: [1, 1],
    },
  });

  test('Map is a Vue instance', () => {
    expect(wrapper.findComponent(yandexMap));
  });

  test('Map is rendered', () => {
    expect(wrapper.classes()).toContain('ymap-container');
  });
});
