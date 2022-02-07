import { mount } from "@vue/test-utils";
import StrokeDiagram from "@/components/StrokeDiagram.vue";
import PrimeVue from "primevue/config";

describe("StrokeDiagram", () => {
  test("Check if the svg element gets created", async () => {
    const wrapper = mount(StrokeDiagram, {
      props: {
        character: "好"
      },
      global: {
        plugins: [PrimeVue]
      }
    });
    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
  });
  test("Check if the click event occurs", async () => {
    const mockAnimateAction = jest.spyOn(StrokeDiagram.methods, "animateButton");
    const wrapper = mount(StrokeDiagram, {
      props: {
        character: "好"
      },
      global: {
        plugins: [PrimeVue]
      }
    });
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Animate");

    // let's click on the button
    await button.trigger("click");
    expect(mockAnimateAction).toHaveBeenCalled();
  });
});
