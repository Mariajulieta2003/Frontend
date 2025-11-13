// src/components/Purchase/PurchasePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import { formatARS } from "../../utils/money";
import "./styles/Purchase.css"; 

const FALLBACK_PLANS = [
  { id: "basic", name: "Basic", priceMonthly: 3999, features: ["Chat 24/7", "Guía de primeros auxilios"] },
  { id: "plus", name: "Plus", priceMonthly: 6999, features: ["Chat + Video", "Recordatorios", "Recetas digitales"] },
  { id: "premium", name: "Premium", priceMonthly: 9999, features: ["Ilimitado", "Plan de salud", "Prioridad <5min"] },
];

export default function PurchasePage({ plans = FALLBACK_PLANS }) {
  const navigate = useNavigate();
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
    if (!plan) {
      // navigate("/plans");
    }
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

  // Lo invoca PaymentForm cuando confirma el pago
  const handleToken = async ({ token, card, payer }) => {
    setServerError(null);
    setProcessing(true);
    try {
      // Simulación de confirmación
      await new Promise((r) => setTimeout(r, 900));
      setSuccess({
        subscriptionId: "sub_" + Math.random().toString(36).slice(2, 8),
        last4: card.last4,
        brand: card.brand,
        planName: plan.name,
      });
      localStorage.setItem(
        "last_subscription",
        JSON.stringify({
          id: plan.id,
          name: plan.name,
          period: "monthly",
          at: Date.now(),
        })
      );
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "No se pudo completar la compra.";
      setServerError(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (!plan) {
    return (
      <div id="purchase-page" className="purchaseShell purchaseLight">
        <div className="panel" style={{ maxWidth: 900, width: "100%", padding: 16 }}>
          <h2>Seleccioná un plan</h2>
          <p>No se encontró el plan solicitado. Volvé a la página de planes.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="purchase-page" className="purchaseShell purchaseLight">
      {/* Encabezado */}
      <header className="pageHeader">
        <h1>Confirmar compra</h1>
        <p className="pageSub">
          Suscripción mensual a <strong>{plan.name}</strong> — {formatARS(plan.priceMonthly)}
        </p>
      </header>

      {/* Grid dos columnas */}
      <div className="purchaseGrid">
        {/* IZQUIERDA: formulario */}
        <section className="purchaseMain">
          {serverError && <div className="alertError">{serverError}</div>}

          {/* Cupón compacto */}
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

          {/* Preview de tarjeta (chico) */}
          <div className="cardPreview" aria-hidden="true">
            <div className="chip" />
          </div>

          {/* Bloque de pago */}
          <div className="panel panelForm">
            <h3 className="panelTitle">Datos de pago</h3>

            {/* Marcas de tarjeta (opcional, visibles sobre fondo claro) */}
            <div className="cardBrands" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <span className="net-icon net-visa" />
              <span className="net-icon net-mc" />
              <span className="net-icon net-am" />
            </div>

            <PaymentForm onToken={handleToken} disabled={processing} />

            <p className="legalNote" style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
              Al confirmar el pago aceptás los Términos y Condiciones y autorizás el débito automático mensual.
            </p>
          </div>
        </section>

        {/* DERECHA: resumen sticky */}
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

      {/* Toast de éxito */}
      {success && (
        <div className="toastSuccess">
          ¡Listo! Suscripción creada ({success.planName}) · Tarjeta {success.brand} **** {success.last4}.
          <button className="toastBtn" onClick={() => navigate("/account")}>
            Ir a mi cuenta
          </button>
        </div>
      )}
    </div>
  );
}
