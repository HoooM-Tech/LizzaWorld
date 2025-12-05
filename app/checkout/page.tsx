// app/checkout/page.tsx
import CheckoutPage from "@/components/checkout-page";
import { Container } from "@/components/container";

export default function Checkout() {
    return (
        <Container className="py-16 lg:py-24">
            <CheckoutPage />;
        </Container>
    )

}