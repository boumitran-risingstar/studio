
'use server';

type UserData = {
  uid: string;
  email: string | null;
  name: string | null;
};

type UpdateUserData = {
    uid: string;
    qualification?: string[];
    profession?: string[];
    linkedinURL?: string;
    twitterURL?: string;
    websiteURL?: string;
    facebookURL?: string;
    pinterestURL?: string;
    confirmationText?: string;
    confirmationTimestamp?: string;
}

export async function createUserInExternalApi(userData: UserData) {
  try {
    const response = await fetch('https://users-164502969077.asia-southeast1.run.app/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
      }),
    });

    if (!response.ok) {
        try {
            const apiError = await response.json();
            console.error('API Error:', apiError);
            return { success: false, error: apiError.message || `An error occurred while syncing your account. Status: ${response.status}` };
        } catch (e) {
            console.error('API response error is not JSON:', response.status, response.statusText);
            return { success: false, error: `An error occurred while syncing your account. Status: ${response.status}` };
        }
    }

    const data = await response.json();
    return { success: true, data };
  } catch (apiError: any) {
    console.error('Network or fetch error:', apiError);
    return { success: false, error: apiError.message || 'A network error occurred. Please try again.' };
  }
}

export async function updateUserInExternalApi(userData: UpdateUserData) {
    try {
      const { uid, ...updateData } = userData;

      const response = await fetch(`https://users-164502969077.asia-southeast1.run.app/update?uid=${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        try {
            const apiError = await response.json();
            console.error('API Error on update:', apiError);
            return { success: false, error: apiError.message || 'An error occurred while updating your profile.' };
        } catch (e) {
            console.error('API update response error is not JSON:', response.status, response.statusText);
            return { success: false, error: `An error occurred while updating your profile. Status: ${response.status}` };
        }
      }
  
      return { success: true };

    } catch (apiError: any) {
      console.error('Network or fetch error on update:', apiError);
      return { success: false, error: apiError.message || 'A network error occurred. Please try again.' };
    }
  }

export async function getUserFromExternalApi(uid: string) {
  try {
    const response = await fetch(`https://users-164502969077.asia-southeast1.run.app/read?uid=${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const apiError = await response.json();
      return { success: false, error: apiError.message || 'An error occurred while fetching your profile.' };
    }

    const userData = await response.json();
    return { success: true, data: userData };
  } catch (apiError: any) {
    console.error('Network or fetch error on read:', apiError);
    return { success: false, error: apiError.message || 'A network error occurred. Please try again.' };
  }
}

export async function getSlugDataFromExternalApi(slug: string) {
    try {
        const response = await fetch(`https://users-164502969077.asia-southeast1.run.app/getSlugData?slugURL=${slug}`);
        if (!response.ok) {
            const apiError = await response.json();
            return { success: false, error: apiError.message || 'Could not find user.' };
        }
        const slugData = await response.json();
        return { success: true, data: slugData };
    } catch (error: any) {
        console.error('Network or fetch error on getSlugData:', error);
        return { success: false, error: error.message || 'A network error occurred.' };
    }
}
