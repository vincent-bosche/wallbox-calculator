import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      // Der Fahrzeugpaar-Hash dient nur als teilbarer Link (siehe VehiclePicker.vue), nicht als Anker-Ziel -
      // ohne dieses Guard würde Vue Router versuchen, zu einem nicht existierenden Element zu scrollen.
      if (document.querySelector(to.hash)) {
        return { el: to.hash, behavior: 'smooth' }
      }
      return false
    }
    // Reine Query-Param-Updates auf derselben Seite (z. B. der Planner/Kostenvergleich-URL-State-Sync)
    // sollen die Scrollposition nicht zurücksetzen - nur ein echter Seitenwechsel scrollt nach oben.
    if (to.path === from.path) return false
    return { top: 0 }
  }
}
