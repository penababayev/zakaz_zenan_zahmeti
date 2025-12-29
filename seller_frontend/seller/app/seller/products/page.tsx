import SellerProductsList from "@/components/SellerProductsList";
import CreateProductForm from "@/components/CreateProductForm";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <CreateProductForm />
      <SellerProductsList />
    </div>
  );
}
