import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import { formatARS } from "../../utils/money";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import "./styles/Purchase.css";

export default function PurchasePage({ plans }) {
  const navigate = useNavigate();
  const { updateSubscription } = useAuth();
  const [params] = useSearchParams();
  const planId = params.get("plan");

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);

  const plan = useMemo(
    () => plans.find((p) => p.id === planId) || null,
    [plans, planId]
  );

  useEffect(() => {
    if (!plan) navigate("/planes");
  }, [plan]);

  const applyCoupon = () => {
    const c = couponInput.trim().toUpperCase();
    if (!c) return;
    if (c === "BIENVENIDA10") setCoupon({ code: c, type: "percent", value: 10 });
    else if (c === "AR$500") setCoupon({ code: c, type: "amount", value: 500 });
    else {
      setCoupon(null);
      alert("Cupón inválido.");
    }
  };

  const removeCoupon = () => setCoupon(null);

  // 🔥 Se ejecuta cuando presionás PAGAR
  const handlePayment = async (data) => {
    setProcessing(true);
    setServerError(null);

    try {
      // Simula pago real
      await new Promise((res) => setTimeout(res, 1200));

      const subscription = {
        id: plan.id,
        name: plan.name,
        price: plan.priceMonthly,
        period: "mensual",
        at: Date.now(),
      };

      // 🔥 Guarda la suscripción en el usuario
      updateSubscription(subscription);

      // 🔥 Mostrar mensaje de éxito
      setSuccess(subscription);

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (e) {
      setServerError("No se pudo completar el pago.");
    } finally {
      setProcessing(false);
    }
  };

  if (!plan) return null;

  return (
    <div id="purchase-page" className="purchaseShell purchaseLight">
      <header className="pageHeader">
        <h1>Confirmar compra</h1>
        <p className="pageSub">
          Suscripción mensual a <strong>{plan.name}</strong> —{" "}
          {formatARS(plan.priceMonthly)}
        </p>
      </header>

      <div className="purchaseGrid">
        <section className="purchaseMain">
          {serverError && <div className="alertError">{serverError}</div>}

          <div className="couponRow">
            <input
              className="couponInput"
              placeholder="Código de cupón"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              disabled={processing}
            />
            <button
              className="couponApply"
              onClick={applyCoupon}
              disabled={processing || !couponInput.trim()}
            >
              Aplicar
            </button>
          </div>

          <div className="cardPreview" aria-hidden="true">
            <div className="chip" />
          </div>

          <div className="panel panelForm">
            <h3 className="panelTitle">Datos de pago</h3>

            <PaymentForm onSubmit={handlePayment} loading={processing} />

            <p className="legalNote">
              Al confirmar el pago aceptás los Términos y autorizás el débito mensual.
            </p>
          </div>
        </section>

        <aside className="purchaseAside">
          <div className="panel summaryPanel">
            <h3 className="panelTitle">Resumen</h3>
            <OrderSummary
              plan={plan}
              billing="monthly"
              coupon={coupon}
              taxes={0.21}
              onRemoveCoupon={removeCoupon}
            />
          </div>
        </aside>
      </div>

      {success && (
        <div className="toastSuccess">
          🎉 ¡Pago realizado con éxito! Suscripción a {success.name} activada.
        </div>
      )}
    </div>
  );
}
