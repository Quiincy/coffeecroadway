import React from "react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function PrivacyPolicyPage() {
  return (
    <AnimatedPage className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Політика конфіденційності</h1>
      
      <div className="space-y-6 text-zinc-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Загальні положення</h2>
          <p>Ця політика конфіденційності визначає порядок отримання, зберігання, обробки та використання персональних даних користувачів. Використовуючи цей сайт, ви погоджуєтесь з даними умовами.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Які дані ми збираємо</h2>
          <p>Ми можемо збирати наступну інформацію при оформленні замовлення:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Ім'я</li>
            <li>Номер телефону</li>
            <li>Адресу доставки</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Використання даних</h2>
          <p>Ми використовуємо зібрані дані виключно для:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Обробки та доставки ваших замовлень</li>
            <li>Зв'язку з вами щодо деталей замовлення</li>
            <li>Покращення якості обслуговування</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Захист даних</h2>
          <p>Ми вживаємо всіх необхідних заходів для захисту ваших персональних даних від несанкціонованого доступу, зміни, розкриття чи знищення.</p>
        </section>
      </div>
    </AnimatedPage>
  );
}
