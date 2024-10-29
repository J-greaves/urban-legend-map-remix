import { MetaFunction, ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import MapComponent from "~/components/MapComponent";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const storyType = formData.get("storyType");
  const story = formData.get("story");
  const latlong = formData.get("latlong");
  if (
    typeof title !== "string" ||
    typeof storyType !== "string" ||
    typeof story !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  console.log({ title, storyType, story, latlong });

  return json({ success: true });
};

export default function Index() {
  const actionData = useActionData();
  return (
    <div className="flex h-screen overflow-visible">
      <div className="w-[15vw] h-full bg-gray-900 shadow-lg shadow-black border-r-2 z-50 border-slate-950 "></div>
      {/* Main content container */}
      <div className="flex-1 flex flex-col">
        <div className="h-[10vh] w-full bg-gray-900 shadow shadow-slate-900 border-b-2 z-40 border-slate-950 "></div>
        <div className="flex-1 flex w-full justify-center items-center ">
          <MapComponent actionData={actionData} />
        </div>
      </div>
    </div>
  );
}
