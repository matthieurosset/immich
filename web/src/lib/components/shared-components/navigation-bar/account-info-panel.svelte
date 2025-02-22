<script lang="ts">
  import Button from '$lib/components/elements/buttons/button.svelte';
  import { AppRoute } from '$lib/constants';
  import { api, UserAvatarColor, type UserResponseDto } from '@api';
  import { createEventDispatcher } from 'svelte';
  import Icon from '$lib/components/elements/icon.svelte';
  import { fade } from 'svelte/transition';
  import UserAvatar from '../user-avatar.svelte';
  import { mdiCog, mdiLogout, mdiPencil } from '@mdi/js';
  import { notificationController, NotificationType } from '../notification/notification';
  import { handleError } from '$lib/utils/handle-error';
  import AvatarSelector from './avatar-selector.svelte';
  import { setUser } from '$lib/stores/user.store';

  export let user: UserResponseDto;

  let isShowSelectAvatar = false;

  const dispatch = createEventDispatcher();

  const handleSaveProfile = async (color: UserAvatarColor) => {
    try {
      if (user.profileImagePath !== '') {
        await api.userApi.deleteProfileImage();
      }

      const { data } = await api.userApi.updateUser({
        updateUserDto: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarColor: color,
        },
      });

      user = data;
      setUser(user);
      isShowSelectAvatar = false;

      notificationController.show({
        message: 'Saved profile',
        type: NotificationType.Info,
      });
    } catch (error) {
      handleError(error, 'Unable to save profile');
    }
  };
</script>

<div
  in:fade={{ duration: 100 }}
  out:fade={{ duration: 100 }}
  id="account-info-panel"
  class="absolute right-[25px] top-[75px] z-[100] w-[360px] rounded-3xl bg-gray-200 shadow-lg dark:border dark:border-immich-dark-gray dark:bg-immich-dark-gray"
>
  <div
    class="mx-4 mt-4 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-4 dark:bg-immich-dark-primary/10"
  >
    <div class="relative">
      {#key user}
        <UserAvatar {user} size="xl" />

        <div
          class="absolute z-10 bottom-0 right-0 rounded-full w-6 h-6 border dark:border-immich-dark-primary bg-immich-primary"
        >
          <button
            class="flex items-center justify-center w-full h-full text-white"
            on:click={() => (isShowSelectAvatar = true)}
          >
            <Icon path={mdiPencil} />
          </button>
        </div>
      {/key}
    </div>
    <div>
      <p class="text-center text-lg font-medium text-immich-primary dark:text-immich-dark-primary">
        {user.name}
      </p>
      <p class="text-sm text-gray-500 dark:text-immich-dark-fg">{user.email}</p>
    </div>

    <a href={AppRoute.USER_SETTINGS} on:click={() => dispatch('close')}>
      <Button color="dark-gray" size="sm" shadow={false} border>
        <div class="flex place-content-center place-items-center gap-2 px-2">
          <Icon path={mdiCog} size="18" />
          Account Settings
        </div>
      </Button>
    </a>
  </div>

  <div class="mb-4 flex flex-col">
    <button
      class="flex w-full place-content-center place-items-center gap-2 py-3 font-medium text-gray-500 hover:bg-immich-primary/10 dark:text-gray-300"
      on:click={() => dispatch('logout')}
    >
      <Icon path={mdiLogout} size={24} />
      Sign Out</button
    >
  </div>
</div>
{#if isShowSelectAvatar}
  <AvatarSelector
    {user}
    on:close={() => (isShowSelectAvatar = false)}
    on:choose={({ detail: color }) => handleSaveProfile(color)}
  />
{/if}
