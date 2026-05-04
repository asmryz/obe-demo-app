import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { createUseStore } from "./utils";

export const store = createStore()(
  persist(
    (set) => ({
      initialized: false,
      signedIn: false,
      posts: [],
      post: null,
      signIn: () => set({ signedIn: true }),
      signOut: () => set({ signedIn: false }),
      setPosts: (posts) => set({ posts }),
      setPost: (post) => set({ post }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useStore = createUseStore(store);

export const postsLoader = async () => {
  console.log("postsLoader");
  const data = await fetch("https://dummyjson.com/posts").then((res) => res.json());
  store.getState().setPosts(data.posts);
  return data;
};

export const postLoader = async ({ params: { id } }) => {
  console.log("postLoader");
  const data = await fetch(`https://dummyjson.com/posts/${id}`).then((res) =>
    res.json()
  );
  store.getState().setPost(data);
  return data;
};
