<script setup lang="ts">
import { computed } from "vue";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/stores/auth";

import { profileDD } from "../../../_mockApis/headerData";
import SimpleBar from "simplebar-vue";

import user1 from "@/assets/images/profile/user-1.jpg";

const router = useRouter();
const authStore = useAuthStore();

const profileUrl = computed(() => {
  if (authStore.user?.id && authStore.isAdmin) {
    return `/admin/users/${authStore.user.id}`;
  }
  return "/profile";
});

function logout() {
  authStore.logout();
  router.push("/auth/login2").catch((err) => {
    if (err?.name !== "NavigationDuplicated") {
      console.error("Logout navigation:", err);
    }
  });
}
</script>

<template>
  <div class="relative group/menu ps-4">
    <DropdownMenu>
      <!-- Trigger -->
      <DropdownMenuTrigger as-child>
        <span
          class="hover:text-primary hover:bg-lightprimary p-1  rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary transition">
          <img :src="user1" alt="user" class="rounded-full w-9 h-9 object-cover" />
        </span>
      </DropdownMenuTrigger>

      <!-- Content -->
      <DropdownMenuContent class="w-screen sm:w-[200px] py-6 rounded-sm">

        <!-- My Profile -->
        <SimpleBar>
          <div>
            <RouterLink
              v-for="(item, index) in profileDD"
              :key="index"
              :to="item.url || profileUrl"
              class="px-4 py-2 flex items-center group hover:bg-lightprimary cursor-pointer"
            >
              <div class="w-full ">
                <div class="ps-0 flex items-center gap-3 w-full ">
                  <Icon :icon="item.img" class="text-lg text-ld  group-hover:text-primary" />
                  <div class="w-3/4 ">
                    <h5 class="mb-0 text-sm text-ld group-hover:text-primary font-normal">
                      {{ item.title }}
                    </h5>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </SimpleBar>

        <!-- Logout -->
        <div class="pt-2 px-4">
          <Button variant="outline" class="w-full" @click="logout">
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
