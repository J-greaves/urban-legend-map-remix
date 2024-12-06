import { useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createNewUser } from "~/db/api";

export interface ActionData {
  error?: string;
  success: boolean;
  status: number;
  user?: {};
}

interface Response {
  error?: string;
  success: boolean;
  status?: number;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const userName = formData.get("userName") as string;
  const avatarUrl = formData.get("avatarUrl") as string | null;

  if (!email || !userName) {
    return json(
      { success: false, error: "Email and username are required" },
      { status: 400 }
    );
  }

  const response = await createNewUser(
    email.toString(),
    userName.toString(),
    avatarUrl ? avatarUrl.toString() : null
  );

  if (response.success) {
    return redirect("/profile");
  }

  return json(
    { success: false, error: response.error || "Unknown error" },
    { status: response.status }
  );
};

const Signup = () => {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form method="post" className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            name="userName"
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatarUrl">Avatar URL (optional)</label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            placeholder="Enter a URL for your avatar"
          />
        </div>
        {actionData?.error && (
          <p className="error-message">{actionData.error}</p>
        )}
        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
