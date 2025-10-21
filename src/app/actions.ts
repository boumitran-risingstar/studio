
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

const API_BASE_URL = 'https://users-164502969077.asia-southeast1.run.app';

export async function createUserInExternalApi(userData: UserData) {
  console.log('--- createUserInExternalApi called with: ---', userData);
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
      }),
    });

    if (response.status !== 201 && response.status !== 200) {
        let errorBody;
        const responseClone = response.clone();
        try {
            errorBody = await responseClone.json();
        } catch (e) {
            errorBody = await response.text();
        }
        console.error('API Error on create:', errorBody);
        const errorMessage = typeof errorBody === 'object' && errorBody.message ? errorBody.message : `An error occurred while syncing your account. Status: ${response.status}`;
        return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (apiError: any) {
    console.error('Network or fetch error on create:', apiError);
    return { success: false, error: apiError.message || 'A network error occurred. Please try again.' };
  }
}

export async function updateUserInExternalApi(userData: UpdateUserData) {
    try {
      const { uid, ...updateData } = userData;

      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        let errorBody;
        const responseClone = response.clone();
        try {
            errorBody = await responseClone.json();
        } catch (e) {
            errorBody = await response.text();
        }
        console.error('API Error on update:', errorBody);
        const errorMessage = typeof errorBody === 'object' && errorBody.message ? errorBody.message : 'An error occurred while updating your profile.';
        return { success: false, error: errorMessage };
      }
      
      const data = await response.json();
      return { success: true, data };

    } catch (apiError: any)      {
      console.error('Network or fetch error on update:', apiError);
      return { success: false, error: apiError.message || 'A network error occurred. Please try again.' };
    }
  }

export async function getUserFromExternalApi(uid: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        let errorBody;
        const responseClone = response.clone();
        try {
            errorBody = await responseClone.json();
        } catch (e) {
            errorBody = await response.text();
        }
        console.error('API Error on read:', errorBody);
        const errorMessage = typeof errorBody === 'object' && errorBody.message ? errorBody.message : 'An error occurred while fetching your profile.';
        return { success: false, error: errorMessage };
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
        const response = await fetch(`${API_BASE_URL}/users/slug/${slug}`);
        if (!response.ok) {
            let errorBody;
            const responseClone = response.clone();
            try {
                errorBody = await responseClone.json();
            } catch (e) {
                errorBody = await response.text();
            }
            console.error('API Error on getSlugData:', errorBody);
            const errorMessage = typeof errorBody === 'object' && errorBody.message ? errorBody.message : 'Could not find user.';
            return { success: false, error: errorMessage };
        }
        const slugData = await response.json();
        return { success: true, data: slugData };
    } catch (error: any) {
        console.error('Network or fetch error on getSlugData:', error);
        return { success: false, error: error.message || 'A network error occurred.' };
    }
}
