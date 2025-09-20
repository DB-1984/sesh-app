import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// the onDelete function we define on the Dashboard page has 
// access to the specific id to filter when called

export function SeshCard({ sesh, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sesh.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <p>{new Date(sesh.date).toLocaleDateString()}</p>
        <div className="flex gap-2">
          <Link to={`sesh/${sesh._id}`}>
            <Button variant="outline">View</Button>
          </Link>
          <Link to={`sesh/${sesh._id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          {/* Here, onDelete is a prop, not the actual function */}
          <Button variant="destructive" onClick={() => onDelete(sesh._id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
