'use server';

type UserData = {
  uid: string;
  email: string | null;
  name: string | null;
};

export async function createUserInExternalApi(userData: UserData) {
  try {
    const response = await fetch('https://users-164502969077.asia-southeast1.run.app/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: userData.uid,
        email: userData.email,
        name: userData.name,
      }),
    });

    if (!response.ok) {
      const apiError = await response.json();
      return { success: false, error: apiError.message || 'An error occurred while syncing your account.' };
    }

    return { success: true };
  } catch (apiError) {
    return { success: false, error: 'A network error occurred. Please try again.' };
  }
}
