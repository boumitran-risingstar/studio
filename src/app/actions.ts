'use server';

export async function createUserInExternalApi(identifier: string) {
  try {
    const response = await fetch('https://users-164502969077.asia-southeast1.run.app/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
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
