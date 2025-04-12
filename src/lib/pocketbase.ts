import PocketBase from 'pocketbase';

// Use an environment variable for the URL (e.g., NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090)
export const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL as string);

// Optionally adjust settings. For example, disable auto-cancellation if using React strict mode:
if (process.env.NODE_ENV === 'development') {
  pb.autoCancellation(false);
}

export default pb;
