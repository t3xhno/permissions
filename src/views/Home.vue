<script lang="ts" setup>
import Permission from '../components/common/permission/Permission.vue';

const comments = [
  {
    id: 1,
    authorId: 1,
    message: "I was posted by user 1, so I can be edited!",
  },
  {
    id: 2,
    authorId: 2,
    message: "I was posted by user 2, so I can't be edited!",
  },
  {
    id: 3,
    authorId: 1,
    message: "I was posted by user 1, so I can be edited!",
  },
];

const onCheck = (hasAccess: boolean) => console.log("On access check: ", hasAccess);
</script>

<template>
  <div class="home">
    <h1 class="text-2xl font-bold my-4">Comments</h1>
    <!-- Determine if a user should have access to the comments section -->
    <Permission
      :roles="['logged-in']"
      @access-check="onCheck"
    >
      <template #no-access>
        <p>You must be logged in to see this content.</p>
      </template>
      <div class="space-y-3">
        <div
          v-for="comment of comments"
          :key="comment.id"
          class="shadow border p-3 flex justify-between"
        >
          <span>{{ comment.message }}</span>
          <!-- Check if a user should be able to see Edit link -->
          <Permission
            :roles="['owner', 'moderator', 'admin']"
            :entityOwnerId="comment.authorId"
          >
            <a>Edit</a>
          </Permission>
        </div>
      </div>
    </Permission>
  </div>
</template>
