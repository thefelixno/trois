import { defineComponent } from "vue"
import { Material } from "../materials"
import {
  MeshPhongMaterial as TMeshPhongMaterial,
  NoBlending as TNoBlending,
  DoubleSide as TDoubleSide,
  Color as TColor,
} from "three"

export default defineComponent({
  name: 'CssMaterial',
  extends: Material,
  methods: {
    createMaterial() {
      return createCssMaterial()
    },
  },
})

export function createCssMaterial() {
  const material = new TMeshPhongMaterial({
    opacity: 0.15,
    color: new TColor(/* color */ 0x111111),
    blending: TNoBlending,
    side: TDoubleSide,
  })
  return material
}
