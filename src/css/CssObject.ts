import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUpdated,
  Ref,
  ref, watch,
} from "vue"
import {
  Object3D,
} from "../core"
import {
  Mesh as TMesh,
  Object3D as TObject3D,
  BoxGeometry as TBoxGeometry,
} from "three"
import {
  CSS3DObject as TCSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer"
import {
  createCssMaterial,
} from "./"
import { bindObjectProp, bindObjectProps, bindProp, bindProps } from "../tools"
import { pointerProps } from "../core/Object3D"

export default defineComponent({
  extends: Object3D,
  props: { ...pointerProps },
  setup(props, ctx) {
    // root element
    const root: Ref<HTMLElement | undefined> = ref()
    // const obj: TObject3D = makeCssWebglObject("div", 0, 0);

    const obj: TObject3D = new TObject3D()

    onMounted(() => {
      // assign root container to cssObj
      if (root.value) {
        obj.userData.cssObj = new TCSS3DObject(root.value)
        obj.add(obj.userData.cssObj)

        // apply styles
        const element : HTMLElement = root.value
        element.style.position = "absolute"
        element.style.display = "inline-block"

        // create the mesh
        const mesh = updateMesh()
      }
    })

    onUpdated(() => {
      updateMesh()
    })

    function createMesh () {
      const geometry = new TBoxGeometry(
        1, 1, 1
      )

      // if mesh already exists, remove
      if (obj.userData.mesh) {
        obj.remove(obj.userData.mesh)
      }

      // "invisible" css material for webgl
      const material = createCssMaterial()

      obj.userData.mesh = new TMesh(geometry, material)
      obj.add(obj.userData.mesh)
    }

    function updateMesh() {
      // if no placeholder mesh exists, create one first
      if (!obj.userData.mesh) createMesh()

      // update mesh geometry to fit bounding Rect
      const mesh = obj.userData.mesh
      mesh.scale.x = root.value?.clientWidth || 0
      mesh.scale.y = root.value?.clientHeight || 0

      return mesh
    }

    return {
      ...props,
      root, // needed to bind html reference
      obj,
    }
  },
  created() {
    // bind events to mesh
    bindObjectProps(this,
      ['onPointerEnter', 'onPointerOver', 'onPointerMove', 'onPointerLeave', 'onClick'],
      this.obj.userData.mesh)

    // init object in parent class Object3D
    this.initObject3D(this.obj)
  },
  render() {
    // render slot for css3dObject
    const defaultSlot = this.$slots.default ? this.$slots.default() : []
    return h("div", { ref: "root", class: "cssObject" }, defaultSlot)
  },
  __hmrId: "CssObject",
})
