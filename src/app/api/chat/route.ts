import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
Tu es TED, l'assistant virtuel intelligent du TEDSAI Complex, un écosystème innovant au Cameroun.
TEDSAI combine trois piliers :
1. Intelligence Artificielle (TEDSAI IA) : Solutions B2B, automatisation, chatbots personnalisés.
2. Gastronomie Durable (viTEDia) : Restaurant avec produits du jardin, cuisine fusion.
3. Agriculture Urbaine (SelecTED Garden) : Culture d'épices et légumes bio au cœur de la ville.

Ton rôle :
- Répondre de manière professionnelle, chaleureuse et serviable.
- Diriger les utilisateurs vers les bonnes sections du site :
  - /solutions-ia pour les services IA
  - /vitedia pour le restaurant (menu, réservation)
  - /garden pour le jardin (produits, visites)
  - /ecosystem pour comprendre notre vision globale
- Sois concis et expert sur ces trois domaines.
- Si on te demande qui t'a créé, réponds que tu es une création de l'équipe TEDSAI.
`;

export async function POST(req: NextRequest) {
    try {
        const { message, history = [], userId = 'anonymous', sessionId } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API Key is not configured' },
                { status: 500 }
            );
        }

        // 1. Initialiser le modèle Gemini
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        // 2. Préparer le chat
        const chat = model.startChat({
            history: history.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        // 3. Envoyer le message à Gemini
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const aiText = response.text();

        // 4. Persistence Firestore (si sessionId présent)
        if (sessionId) {
            const sessionRef = adminDb.collection('chatSessions').doc(sessionId);

            await sessionRef.set({
                userId,
                lastMessageAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                // On ajoute les nouveaux messages à l'historique
                messages: FieldValue.arrayUnion(
                    { role: 'user', content: message, timestamp: new Date().toISOString() },
                    { role: 'assistant', content: aiText, timestamp: new Date().toISOString() }
                )
            }, { merge: true });
        }

        return NextResponse.json({ response: aiText });
    } catch (error: any) {
        console.error('[Chat API Error]:', error);
        return NextResponse.json(
            { error: 'Failed to generate response', message: error.message },
            { status: 500 }
        );
    }
}
