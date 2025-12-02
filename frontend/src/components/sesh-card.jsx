import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function SeshCard({ sesh, onDelete }) {
  return (
    <Card className="w-full flex flex-col gap-4">
      <CardHeader>
        <CardTitle>{sesh.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <p>{new Date(sesh.date).toLocaleDateString()}</p>
        <div className="flex gap-2">
          <Link to={`sesh/${sesh._id}`}>
            <Button variant="outline">View</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => onDelete(sesh._id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
