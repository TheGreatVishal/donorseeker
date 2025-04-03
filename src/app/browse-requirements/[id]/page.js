import RequirementDetails from "./requirement-details";

export async function generateMetadata({ params }) {
  return {
    title: `Requirement Details - ${params.id} | Donor Seeker`,
    description: "View requirement details and contact the requester",
  };
}

export default function RequirementDetailsPage({ params }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <RequirementDetails id={params.id} />
    </main>
  );
}
