import { Card, CardTitle } from "@/components/ui/card";

function MoreIncoming() {
  return (
    <Card className="w-full max-w-sm text-center justify-center bg-white border-2 border-black shadow-shadow p-4 opacity-70 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
      <CardTitle className="text-xl font-bold uppercase">More Incoming...</CardTitle>
    </Card>
  );
}

export default MoreIncoming;
