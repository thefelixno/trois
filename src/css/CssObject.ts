import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUpdated,
  Ref,
  ref,
} from "vue"
import {
  Object3D,
} from "../"
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

export default defineComponent({
  extends: Object3D,
  setup(props, ctx) {
    // root element
    const root: Ref<HTMLElement | undefined> = ref()
    // const obj: TObject3D = makeCssWebglObject("div", 0, 0);

    const obj: TObject3D = new TObject3D()

    const material = createCssMaterial()

    const size = computed(() => {
      return {
        width: root.value?.clientWidth,
        height: root.value?.clientHeight,
      }
    })

    onMounted(() => {
      // assign root container to cssObj
      if (root.value) {
        obj.userData.cssObj = new TCSS3DObject(root.value)
        obj.add(obj.userData.cssObj)
        updateMesh()
      }
    })

    onUpdated(() => {
      updateMesh()
    })

    function updateMesh() {
      const geometry = new TBoxGeometry(
        obj.userData.cssObj.element.clientWidth,
        obj.userData.cssObj.element.clientHeight,
        2
      )

      if (obj.userData.mesh) {
        obj.remove(obj.userData.mesh)
      }

      obj.userData.mesh = new TMesh(geometry, material)
      obj.add(obj.userData.mesh)
    }

    return {
      root, // needed to bind html reference
      obj,
    }
  },
  created() {
    this.initObject3D(this.obj)
  },
  render() {
    // render slot for css3dObject
    const defaultSlot = this.$slots.default ? this.$slots.default() : []
    return h("div", { ref: "root" }, defaultSlot)
  },
  __hmrId: "CSS3D",
})
