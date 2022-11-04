import { ref, Ref, readonly } from "vue";

export interface IUser {
  id: number;
  name: string;
  roles: string[];
};

const userState: Ref<IUser> = ref({
  id: 2,
  name: "William",
  roles: ["admin"],
});

/**
 * Return a readonly user state to prevent direct mutation
 */
export const getUser = () => readonly(userState);

/**
 * Set new user state
 */
export type SetUser = (data: IUser) => void;
export const setUser: SetUser = (data) => (userState.value = data);

/**
 * Update user state value by the key passed
 */
export type UpdateUser = <T extends keyof IUser>(key: T, value: IUser[T]) => void;
export const updateUser: UpdateUser = (key, value) => (userState.value[key] = value);

const readonlyUser = getUser();

export const useUser = () => {
  return {
    setUser,
    updateUser,
    user: readonlyUser,
  };
};
