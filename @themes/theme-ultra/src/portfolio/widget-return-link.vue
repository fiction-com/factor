<template>
  <div class="return-link">
    <factor-link class="back" :path="setting('portfolio.indexRoute')">
      <factor-icon icon="fas fa-arrow-left" />
      <span>{{ returnLinkText }}</span>
    </factor-link>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { stored } from "@factor/app/store"
import { setting } from "@factor/api"
export default {
  components: { factorLink, factorIcon },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    returnLinkText() {
      return setting("portfolio.returnLinkText") || "All Posts"
    },
  },
  methods: { setting },
}
</script>
