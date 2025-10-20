
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
        identifier: userData.uid,
        email: userData.email,
        name: userData.name,
      }),
    });

    if (!response.ok) {
      const apiError = await response.json();
      return { success: false, error: apiError.message || 'An error occurred while syncing your account.' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (apiError) {
    return { success: false, error: 'A network error occurred. Please try again.' };
  }
}

export async function updateUserInExternalApi(userData: UpdateUserData) {
    try {
      const params = new URLSearchParams();
      params.append('uid', userData.uid);
      
      if (userData.qualification) {
        userData.qualification.forEach(q => params.append('qualification', q));
      }
      if (userData.profession) {
        userData.profession.forEach(p => params.append('profession', p));
      }
      if (userData.linkedinURL) params.append('linkedinURL', userData.linkedinURL);
      if (userData.twitterURL) params.append('twitterURL', userData.twitterURL);
      if (userData.websiteURL) params.append('websiteURL', userData.websiteURL);
      if (userData.facebookURL) params.append('facebookURL', userData.facebookURL);
      if (userData.pinterestURL) params.append('pinterestURL', userData.pinterestURL);
      if (userData.confirmationText) params.append('confirmationText', userData.confirmationText);
      if (userData.confirmationTimestamp) params.append('confirmationTimestamp', userData.confirmationTimestamp);


      const response = await fetch(`https://users-164502969077.asia-southeast1.run.app/update?${params.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        // The API might return an error with a JSON body
        try {
            const apiError = await response.json();
            return { success: false, error: apiError.message || 'An error occurred while updating your profile.' };
        } catch (e) {
            // If parsing the error fails, return a generic error
            return { success: false, error: `An error occurred while updating your profile. Status: ${response.status}` };
        }
      }
  
      // If the response is OK, we don't expect a body for a PUT request.
      // Simply return success.
      return { success: true };

    } catch (apiError) {
      return { success: false, error: 'A network error occurred. Please try again.' };
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
  } catch (apiError) {
    return { success: false, error: 'A network error occurred. Please try again.' };
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
    } catch (error) {
        return { success: false, error: 'A network error occurred.' };
    }
}
