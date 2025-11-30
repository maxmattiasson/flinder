import { getAuthState } from "../api/auth.js";
import { supabase } from "../api/supabase.js";
import { getYesVotes } from "../api/votes.js";

export async function initProfile() {
  const friendCode = await getFriendCode();
  renderProfile(friendCode);
  const friendCodes = await getFriendsForUI();
  renderFriendsList(friendCodes);
  renderDisplayName();
  addListeners();

  document.querySelector("#reset-storage").addEventListener("click", () => {
    localStorage.clear();
    console.log("reset local storage");
  });
}

function generateFriendCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomNum = Math.floor(Math.random() * chars.length);
    code += chars[randomNum];
  }
  return code;
}
async function getFriendCode() {
  const user = await getAuthState();
  if (!user) return; // Maybe return SIGNUPNOW hehe

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("friend_code")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  if (profile) {
    return profile.friend_code;
  }

  let friendCode = generateFriendCode();

  const { data: insertData, error: insertError } = await supabase
    .from("user_profiles")
    .insert([
      {
        user_id: user.id,
        friend_code: friendCode,
      },
    ])
    .select("friend_code")
    .single();
  if (insertError) {
    console.log("error posting friend code", insertError);
  }
  return insertData.friend_code;
}
function renderProfile(friendCode) {
  const main = document.querySelector("main");

  const codeCont = document.createElement("div");
  codeCont.textContent = `Your code: ${friendCode}`;
  codeCont.classList.add("friend-code");
  main.append(codeCont);
}
async function handleAddFriend() {
  const infoField = document.getElementById("add-info");
  const inputField = document.getElementById("add-input");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let infoId;
  clearTimeout(infoId);

  const input = inputField.value.toUpperCase().trim();

  if (input.length !== 4) {
    infoField.textContent = "Code needs to be 4 characters";
    infoId = setTimeout(() => {
      infoField.textContent = "";
    }, 5000);
    return;
  }
  for (const char of input) {
    if (!chars.includes(char)) {
      infoField.textContent = "Code needs to be letters or numbers";
      infoId = setTimeout(() => {
        infoField.textContent = "";
      }, 5000);
      return;
    }
  }
  const { data: friendProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("user_id, friend_code")
    .eq("friend_code", input)
    .maybeSingle();

  if (profileError) {
    console.log("error getting friend code table", profileError);
    return;
  }
  if (!friendProfile) {
    infoField.textContent = "No user with that code";
    infoId = setTimeout(() => (infoField.textContent = ""), 5000);
    return;
  }
  const user = await getAuthState();
  if (!user) return;

  if (friendProfile.user_id === user.id) {
    infoField.textContent = "You cannot add yourself";
    infoId = setTimeout(() => (infoField.textContent = ""), 5000);
    return;
  }
  const { data: insert, error: insertError } = await supabase
    .from("user_friends")
    .insert([
      {
        owner_id: user.id,
        friend_id: friendProfile.user_id,
      },
    ])
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      infoField.textContent = "Already added this friend";
      infoId = setTimeout(() => (infoField.textContent = ""), 5000);
      return;
    }
    console.error("Error adding friend:", insertError);
    return;
  }
  infoField.textContent = "Friend added!";
  inputField.value = "";
  infoId = setTimeout(() => (infoField.textContent = ""), 5000);
}

function addListeners() {
  // Add friend
  document.getElementById("add-cont").addEventListener("submit", (e) => {
    e.preventDefault();
    handleAddFriend();
  });

  // Open name change dialog
  document.getElementById("edit-name-btn").addEventListener("click", () => {
    document.getElementById("change-name").showModal();
  });

  // Close name change dialog
  document
    .getElementById("cancel-name")
    .addEventListener("click", () =>
      document.getElementById("change-name").close()
    );

  // Clear input in change name
  document
    .getElementById("input-display-name")
    .addEventListener("input", () => {
      document.getElementById("name-change-info").textContent = "";
    });
  // Handle name change submit
  document
    .getElementById("change-name-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputField = document.getElementById("input-display-name");
      const regex = /^[A-Za-z0-9ÅÄÖåäö]+$/;
      const input = inputField.value.trim();

      if (!regex.test(input)) {
        document.getElementById("name-change-info").textContent =
          "Only letters and numbers";
        return;
      }
      document.getElementById("name-change-info").textContent = "";
      await setDisplayName(input);
    });
}

async function getFriendsForUI() {
  const user = await getAuthState();
  if (!user) return;

  const { data, error } = await supabase
    .from("user_friends")
    .select("*")
    .eq("owner_id", user.id);
  if (error) {
    console.log("Error with getting friendslist from supabase", error);
  }
  const friendIDs = data.map((el) => el.friend_id);

  const { data: friendsCode, error: friendError } = await supabase
    .from("user_profiles")
    .select("friend_code, display_name")
    .in("user_id", friendIDs);

  return friendsCode;
}
async function renderFriendsList(friendCodes) {
  const container = document.getElementById("friends-list");

  container.textContent = "Friendslist";

  [...friendCodes].forEach((friend) => {
    const friendCont = document.createElement("div");
    if (friend.display_name === null && friend.friend_code === null) {
      friendCont.textContent = "Unknown";
    } else if (friend.display_name !== null) {
      friendCont.textContent = friend.display_name;
    } else if (friend.friend_code !== null) {
      friendCont.textContent = friend.friend_code;
    }
    container.append(friendCont);
  });
}

async function getDisplayName() {
  const user = await getAuthState();
  if (!user) return;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.log("Error getting display name ", error);
  }
  return data.display_name;
}

async function setDisplayName(input) {
  const user = await getAuthState();
  if (!user) return;

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      { user_id: user.id, display_name: input },
      { onConflict: "user_id" }
    )
    .select()
    .single();
  if (error) {
    console.log("Error with upsert name", error);
    return;
  }
  await renderDisplayName(input);
}

async function renderDisplayName(input) {
  const displayName = await getDisplayName();
  const nameElement = document.getElementById("display-name");

  if (displayName === null) {
    nameElement.textContent = "Name";
  }
}
