<script lang="ts" setup>
import { watch, ref } from "vue";
import { checkPermission } from "./checkPermission";
import { getUser } from "../../../composables/useUser";

const emits = defineEmits(["access-check"]);
const props = withDefaults(defineProps<{
  type?: "one-of" | "all-of";
  roles: string[];
  debug?: boolean;
  entityOwnerId?: string | number;
}>(), {
  debug: false,
  type: "one-of",
});

const hasAccess = ref(false);
const user = getUser();

/**
 * Permissions will be checked
 * - when this component is created
 * - when user id changes
 * - when user roles array changes
 * - when any of the props change
 */
watch([
  props,
  () => user.value?.id,
  () => user.value?.roles,
], ([props, _userId, _roles]) => {
  hasAccess.value = checkPermission(props.roles, {
    type: props.type,
    debug: props.debug,
    entityOwnerId: props.entityOwnerId,
  });
  emits("access-check", hasAccess.value);
}, { immediate: true });
</script>

<template>
  <slot v-if="hasAccess" />
  <slot v-else name="no-access" />
</template>
