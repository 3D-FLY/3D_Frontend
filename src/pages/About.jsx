import React from "react";
import Background from "../components/ui/Background";

export default function About() {
  return (
    <Background variant="gray">
     <div className="mx-auto w-full max-w-5xl px-6 py-14">
        <h1 className="text-4xl font-extrabold italic text-white/90">
          LONG PAGE DEMO
        </h1>
        <p className="mt-3 text-lg text-white/70">
          דף בדיקה ארוך כדי לראות את הצבים ב־110vh, 220vh, 330vh…
        </p>

        {/* הרבה בלוקים כדי "למתוח" את העמוד */}
        <div className="mt-10 space-y-8">
          {Array.from({ length: 28 }).map((_, i) => (
            <section
              key={i}
              className="rounded-[26px] bg-white/10 p-8 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-white">
                Section #{i + 1}
              </h2>

              <p className="mt-3 text-white/75 leading-7">
                זה טקסט דמה שמטרתו להאריך את העמוד. אפשר להחליף אותו בתוכן אמיתי
                בהמשך. כרגע אנחנו רק רוצים לראות איך האלמנטים הדקורטיביים (הצב)
                מתנהגים ככל שהעמוד נהיה ארוך יותר, ואיך הם מופיעים לסירוגין ימין/שמאל.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-black/20 p-5 text-white/70">
                  <div className="text-sm uppercase tracking-wider text-white/50">
                    Block A
                  </div>
                  <p className="mt-2 leading-7">
                    עוד קצת טקסט כדי ליצור גובה, וגם לבדוק שהרקע נשאר רציף לכל אורך
                    הדף וששום דבר לא נשבר.
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-5 text-white/70">
                  <div className="text-sm uppercase tracking-wider text-white/50">
                    Block B
                  </div>
                  <p className="mt-2 leading-7">
                    אם את רוצה להאריך אפילו יותר — פשוט תגדילי את המספר בתוך
                    Array.from({`{ length: 28 }`}) ל־40 או 50.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
                  Tag #{i + 1}
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
                  Layout Test
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
                  Scroll
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
                  Background
                </span>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-[30px] bg-black/25 p-10 text-white/80">
          <h3 className="text-2xl font-bold">Footer Area</h3>
          <p className="mt-3 leading-7">
            זה סוף הדף. אם הגעת לפה, סימן שהעמוד מספיק ארוך כדי לראות כמה צבים.
            שימי לב שהם צריכים להופיע בערך ב־110vh, 220vh, 330vh ולסירוגין ימין/שמאל.
          </p>
        </div>
      </div>
    </Background>
        
  );
}
