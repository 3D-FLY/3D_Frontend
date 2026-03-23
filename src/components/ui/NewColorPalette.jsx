// דוגמאות לשימוש בשלושת הצבעים החדשים

export const NewColorPalette = () => {
  return (
    <div className="p-8 space-y-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-dark mb-8">צבעי הפרויקט החדשים</h1>

      {/* שלושת הצבעים הראשיים */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">הצבעים של הפרויקט</h2>
        <div className="grid grid-cols-3 gap-6 max-w-4xl">
          {/* צבע כהה */}
          <div className="bg-dark p-6 rounded-lg text-white text-center shadow-lg">
            <div className="font-semibold text-lg">Dark</div>
            <div className="text-sm opacity-90 mt-2">#222222</div>
            <div className="text-xs mt-2 opacity-75">צבע עיקרי כהה</div>
          </div>

          {/* צבע ירוק */}
          <div className="bg-green p-6 rounded-lg text-white text-center shadow-lg">
            <div className="font-semibold text-lg">Green</div>
            <div className="text-sm opacity-90 mt-2">#5ac422</div>
            <div className="text-xs mt-2 opacity-75">צבע הדגשה ירוק</div>
          </div>

          {/* צבע אפור */}
          <div className="bg-gray p-6 rounded-lg text-white text-center shadow-lg">
            <div className="font-semibold text-lg">Gray</div>
            <div className="text-sm opacity-90 mt-2">#959595</div>
            <div className="text-xs mt-2 opacity-75">צבע משני אפור</div>
          </div>
        </div>
      </div>

      {/* דוגמאות לכפתורים */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">דוגמאות לכפתורים</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-dark hover:bg-gray text-white px-6 py-3 rounded-lg transition-colors shadow">
            כפתור כהה
          </button>
          <button className="bg-green hover:opacity-90 text-white px-6 py-3 rounded-lg transition-opacity shadow">
            כפתור ירוק
          </button>
          <button className="bg-gray hover:bg-dark text-white px-6 py-3 rounded-lg transition-colors shadow">
            כפתור אפור
          </button>
          <button className="border-2 border-dark text-dark hover:bg-dark hover:text-white px-6 py-3 rounded-lg transition-colors">
            כפתור מסגרת כהה
          </button>
          <button className="border-2 border-green text-green hover:bg-green hover:text-white px-6 py-3 rounded-lg transition-colors">
            כפתור מסגרת ירוק
          </button>
        </div>
      </div>

      {/* דוגמאות לטקסט */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">דוגמאות לטקסט</h2>
        <div className="space-y-3">
          <p className="text-dark text-lg font-semibold">
            כותרת בצבע כהה - מתאימה לכותרות ראשיות
          </p>
          <p className="text-green text-lg font-medium">
            טקסט בירוק - מתאים להדגשות והודעות חיוביות
          </p>
          <p className="text-gray text-base">
            טקסט באפור - מתאים לטקסט רגיל ומידע משני
          </p>
        </div>
      </div>

      {/* דוגמאות לרקעים */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">דוגמאות לרקעים</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-2">רקע כהה</h3>
            <p className="text-sm opacity-90">מתאים לכותרות וסרגלי ניווט</p>
          </div>
          <div className="bg-green p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-2">רקע ירוק</h3>
            <p className="text-sm opacity-90">
              מתאים להודעות הצלחה ופעולות חיוביות
            </p>
          </div>
          <div className="bg-gray p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-2">רקע אפור</h3>
            <p className="text-sm opacity-90">מתאים לאזורי תוכן משניים</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewColorPalette;
