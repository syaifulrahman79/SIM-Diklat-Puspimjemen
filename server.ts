import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { TRAINING_PROGRAMS } from "./src/data/programsData.ts";
import { LECTURERS_DATA, SUBJECT_MATRICES } from "./src/data/lecturersData.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

app.use(express.json());

// Initialize Gemini Client with aistudio-build header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Master System Prompt from SIM_Diklat_Puspimjemenhan_TA2027_Prompt_3d9f2fdc.pdf
const MASTER_SYSTEM_INSTRUCTION = `
# ROLE & IDENTITY
Anda adalah Mesin Logika Backend dan Asisten Cerdas untuk "Sistem Informasi Manajemen Diklat Puspimjemenhan (SIM-DIKLAT PUSPIMJEMENHAN)", Pusat Kepemimpinan dan Manajemen Pertahanan, BPSDM Pertahanan Kemhan RI.
Aplikasi ini melayani pengelolaan program diklat, pengecekan kurikulum, verifikasi syarat peserta, pencocokan (assignment) Widyaiswara pengampu materi, hingga generasi payload data sistem.

---
# CORE CAPABILITIES & OPERATIONAL PROTOCOLS
1. Mode Informasi Publik / Interaktif:
 - Menjawab pertanyaan terkait katalog 43 program pelatihan Puspimjemenhan TA 2027 (deskripsi, syarat pangkat/pendidikan, durasi, dan tanggal pelaksanaan).
 - Menjawab menggunakan tata bahasa dinas resmi, lugas, santun, dan profesional di lingkungan Kementerian Pertahanan dan TNI.
2. Mode Validasi & Eligibility Engine:
 - Memvalidasi kelayakan personel berdasarkan jenjang kepangkatan (TNI: Tamtama/Bintara/Pama/Pamen; ASN: Pengatur II, Penata III, Pembina IV; PPPK), batas usia maksimal, dan kualifikasi pendidikan/jabatan.
3. Mode Penugasan Widyaiswara (Matching Engine):
 - Mencocokkan kurikulum mata pelatihan dengan Direktori Kepakaran Widyaiswara Salemba (Madya, Muda, Pertama).
 - Mencegah benturan jadwal pelatihan klasikal pada rentang tanggal yang sama.
4. Mode Integrasi Sistem (JSON API Data Engine):
 - Apabila diminta luaran terstruktur, hasilkan skema JSON valid dengan format:
{
  "status": "success",
  "action": "<get_catalog | check_eligibility | assign_lecturer | generate_schedule>",
  "data": { ... }
}

# DIREKTORI WIDYAISWARA & DISTRIBUSI PENGAMPU MATERI (SALEMBA 2026):
Total 28 Widyaiswara (16 Madya & Muda, 12 Pertama)
Materi & Pengampu:
- Bela Negara / Sishanneg: Kol Pas Syamsul Hilal; Kolonel Arh Raden Novi Setiana; Kol Inf. Toto Gunarto.
- Anti Korupsi: Kolonel Laut (S) Dawinto; Dr. Juwita; Yenni Kusuma Mawarsi.
- Reformasi Birokrasi: Dwi Agus Riyanto; Hendra Komara.
- SKP (Sasaran Kinerja Pegawai): Suhendra; Arief Iswanto; Asep Ridwan; Eko Wahyono Tikno.
- Pelayanan Publik: Lamsari Intan Margaretha; Asep Ridwan; Bernadeta Intan Hanto; Daiatul Istiqomah.
- Pengenalan / Pengelolaan Minu: Kol Caj (K) Dr. Sri Iswati; Hari Widodo; Miftahul Alam Al Waro’.
- Etika Profesi ASN: Sutikno; Lamsari Intan Margaretha; Kingkin Rizki Amalia.
- Akuntabilitas Kinerja: Kol Inf. Toto Gunarto; Wela Hasmaida.
- Disiplin PNS: Lamsari Intan Margaretha; Asep Ridwan; Lulu Fatihatul Uyun.
- Manajemen Kepegawaian Negara: Suhendra; Arief Iswanto; Hanum Midya Syahrina.
- Manajemen Perkantoran Modern: Kol Caj (K) Dr. Sri Iswati; Lily Febrianty; Hanum Midya Syahrina; Aulia Febliana Chaniago.
- Komunikasi dlm Organisasi: Kol Pas Syamsul Hilal; Miftahul Alam Al Waro’.
- Pemanfaatan TI: Kolonel Laut (S) Dawinto; Sutikno; Afriyanto; Aulia Febliana Chaniago; Imtiyaz Fawa'ida.
- Teknik Presentasi: Dr. Juwita; Wela Hasmaida; Imtiyaz Fawa'ida.
- Dasar-dasar Kepemimpinan: Kol Pas Syamsul Hilal; Daiatul Istiqomah.
- Dinamika Kelompok (DK) / Outbound: Hari Widodo; Sutikno; Afriyanto; Asep Ridwan.
- Manajemen Strategis & Kepemimpinan Pertahanan: Donny George Pattisamallo.

MANAJEMEN BEBAN MENGAJAR BERIMBANG WIDYAISWARA (WORKLOAD BALANCER):
Sistem mengelola dan mengatur penugasan materi kepada seluruh 28 Widyaiswara (16 Madya & Muda, 12 Pertama) secara proporsional dan berimbang:
- Target kuota beban kerja: 3 sampai 4 program diklat per Widyaiswara sepanjang TA 2027.
- Bebas benturan jadwal (Zero Conflict): Algoritma memeriksa irisan rentang tanggal pelaksanaan untuk memastikan tidak ada Widyaiswara yang ditugaskan pada dua kegiatan yang berjalan bersamaan.
- Validasi Tunggal Mata Pelatihan (Anti Tumpang Tindih Materi): Jika suatu mata pelatihan pada program diklat tertentu telah ditugaskan kepada seorang Widyaiswara, sistem secara otomatis MENOLAK (notifikasi tertolak) penambahan Widyaiswara lain pada materi yang sama di diklat tersebut guna menjamin kepastian 1 pengampu utama per materi.
- Klasifikasi Beban:
  * UNDERLOAD: Beban < 3 Diklat (Perlu tambahan penugasan)
  * BALANCED: Beban 3 - 4 Diklat (Beban Ideal / Berimbang)
  * OVERLOAD: Beban > 4 Diklat (Kelebihan beban)
- Rasio Keseimbangan (Balance Index): Mencapai >95% dengan rata-rata beban sekitar 3.3 diklat/WI.
`;

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    totalPrograms: TRAINING_PROGRAMS.length,
    totalLecturers: LECTURERS_DATA.length,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/programs", (req, res) => {
  res.json(TRAINING_PROGRAMS);
});

app.get("/api/lecturers", (req, res) => {
  res.json({
    lecturers: LECTURERS_DATA,
    subjectMatrices: SUBJECT_MATRICES
  });
});

// AI Chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, returnJson } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    if (ai) {
      try {
        const contents: any[] = [];
        
        // Add chat history if present
        if (Array.isArray(history)) {
          history.forEach((h: { role: string; text: string }) => {
            contents.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            });
          });
        }

        // Add current user message
        let promptText = message;
        if (returnJson) {
          promptText += "\n\n[PENTING]: Format respon secara ketat dalam JSON terstruktur dengan format {\"status\": \"success\", \"action\": \"...\", \"data\": { ... }}";
        }
        contents.push({
          role: 'user',
          parts: [{ text: promptText }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents,
          config: {
            systemInstruction: MASTER_SYSTEM_INSTRUCTION,
            responseMimeType: returnJson ? "application/json" : "text/plain"
          }
        });

        const textOutput = response.text || "";
        return res.json({
          reply: textOutput,
          source: "gemini-3.8-flash"
        });
      } catch (geminiError: any) {
        console.error("Gemini API Error, using knowledge engine fallback:", geminiError);
        // Fall through to fallback engine
      }
    }

    // Fallback Intelligent Knowledge Engine based on official document
    const query = message.toLowerCase();
    let reply = "";

    if (returnJson || query.includes("json")) {
      if (query.includes("katalog") || query.includes("program")) {
        reply = JSON.stringify({
          status: "success",
          action: "get_catalog",
          data: {
            total_programs: TRAINING_PROGRAMS.length,
            programs_sample: TRAINING_PROGRAMS.slice(0, 5).map(p => ({
              id: p.id,
              code: p.code,
              name: p.name,
              metode: p.method,
              durasi: p.durationLabel,
              pelaksanaan: p.displayDate,
              sasaran_tni: p.targetParticipants.tni || "-",
              sasaran_pns: p.targetParticipants.pns || "-"
            }))
          }
        }, null, 2);
      } else if (query.includes("widyaiswara") || query.includes("pengampu")) {
        reply = JSON.stringify({
          status: "success",
          action: "assign_lecturer",
          data: {
            total_widyaiswara: LECTURERS_DATA.length,
            madya_muda_count: 16,
            pertama_count: 12,
            subject_matrices: SUBJECT_MATRICES
          }
        }, null, 2);
      } else {
        reply = JSON.stringify({
          status: "success",
          action: "check_eligibility",
          data: {
            message: "Evaluasi kualifikasi SIM-DIKLAT Puspimjemenhan TA 2027 siap diproses.",
            timestamp: new Date().toISOString()
          }
        }, null, 2);
      }
    } else if (query.includes("bela negara") || query.includes("sishanneg")) {
      reply = `Siap! Untuk mata pelatihan **Bela Negara dalam Perspektif Sishanneg**, Widyaiswara pengampu resmi di Kampus Salemba adalah:
1. **Kol Pas Syamsul Hilal, S.Pd., M.Han.** (Departemen Kepemimpinan & Kejuangan)
2. **Kolonel Arh Raden Novi Setiana, S.I.P.** (Departemen Kepemimpinan & Strategi)
3. **Kol Inf. Drs. Toto Gunarto, M.Han.** (Departemen Manajemen Pertahanan)

Materi ini diajarkan di berbagai diklat kepemimpinan seperti Diklat 01, Diklat 02 (Suskatjemen Hanneg), Diklat 09, Diklat 11, dan Diklat 17.`;
    } else if (query.includes("cyber") || query.includes("siber") || query.includes("soc")) {
      reply = `Siap! Terkait Pelatihan Bidang Siber & Teknologi Puspimjemenhan TA 2027:
1. **Pelatihan Cyber Defence (Diklat-16)**:
   - Pelaksanaan: 2 Gelombang (Gel I: 5 Apr - 4 Jun 2027, Gel II: 28 Jun - 20 Agt 2027)
   - Metode: Klasikal 2 Bulan di Lab Cyber Security Salemba
   - Sasaran: TNI min. Bintara, PNS min. Pengda II/a, Alokasi 50 orang.
   - Sertifikasi: Junior Penetration Tester (JPT) & ADEFR.
2. **Pelatihan SOC Analyst Level 1 (Diklat-22)**:
   - Pelaksanaan: 7 s.d. 18 Juni 2027 (10 Hari Klasikal)
   - Sasaran: Personel pengelola TIK / SOC unit pertahanan.
3. **Pelatihan Teknis Keamanan Siber (Diklat-26)**:
   - Pelaksanaan: 19 s.d. 30 Juli 2027 (14 Hari Klasikal).`;
    } else if (query.includes("pka") || query.includes("pkp") || query.includes("kepemimpinan")) {
      reply = `Siap! Berikut informasi Diklat Kepemimpinan Struktural Puspimjemenhan TA 2027:
1. **PKA (Pelatihan Kepemimpinan Administrator) - Diklat 15**:
   - Jadwal: 31 Maret s.d. 30 Juli 2027 (3 Bulan, Blended Learning)
   - Sasaran: Pejabat Administrator / JF Ahli Madya / Pengawas min III/c masa kerja 3,5 tahun. Kuota 20 orang.
2. **PKP (Pelatihan Kepemimpinan Pengawas) - Diklat 20**:
   - Jadwal: 2 Gelombang (Gel I: 26 Apr-27 Agt 2027, Gel II: 9 Agt-3 Des 2027)
   - Sasaran: PNS min. Penata Muda Tk. I III/b masa dinas 2 tahun, kuota 80 orang.
3. **Suskatjemen Hanneg untuk Eksekutif - Diklat 02**:
   - 3 Gelombang: Jan, Agt, Nov 2027 bagi Kolonel/Kombes dan PNS Pembina IV/a.`;
    } else if (query.includes("beban") || query.includes("berimbang") || query.includes("alokasi tugas") || query.includes("kuota")) {
      reply = `Siap! Manajemen Distribusi Beban Mengajar Berimbang Puspimjemenhan TA 2027:
- **Total Widyaiswara**: 28 Personel (16 Jenjang Madya & Muda, 12 Jenjang Pertama).
- **Target Kuota Berimbang**: Rata-rata 3 sampai 4 program diklat per Widyaiswara sepanjang tahun anggaran 2027.
- **Indeks Keseimbangan**: ~96% - 100% (Seluruh pengampu menerima porsi mengajar proporsional).
- **Verifikasi Nol Benturan (Zero Conflict)**: Algoritma memeriksa rentang tanggal mulai-selesai seluruh diklat untuk memastikan tidak ada pengampu yang ditugaskan pada dua program beririsan.
- **Matriks Pengampu**: Penugasan disesuaikan dengan 17 rumpun materi kompetensi (Bela Negara, Minu, TI, SKP, Pelayanan Publik, Anti Korupsi, Reformasi Birokrasi, dll.).
- **Dokumen Kedinasan**: Rekapitulasi dapat dicetak langsung dalam format resmi Minu Kemhan RI ber-Kop Surat Puspimjemenhan Badiklat Kemhan.`;
    } else if (query.includes("widyaiswara") || query.includes("wi") || query.includes("dosen") || query.includes("pengajar")) {
      reply = `Siap! Berdasarkan register Widyaiswara Salemba BPSDM Kemhan, terdapat 28 Widyaiswara aktif:
- **16 Widyaiswara Madya & Muda**: Kol Pas Syamsul Hilal, Kolonel Arh Raden Novi Setiana, Kol Inf Toto Gunarto, Kolonel Laut Dawinto, Dwi Agus Riyanto, Kol Caj Dr. Sri Iswati, Lily Febrianty, Donny George Pattisamallo, Suhendra, Hari Widodo, Arief Iswanto, Sutikno, Lamsari Intan Margaretha, Dr. Juwita, Afriyanto, Asep Ridwan.
- **12 Widyaiswara Pertama**: Yenni Kusuma Mawarsi, Hendra Komara, Eko Wahyono Tikno, Bernadeta Intan, Miftahul Alam, Kingkin Rizki, Wela Hasmaida, Lulu Fatihatul, Hanum Midya, Daiatul Istiqomah, Aulia Febliana, Imtiyaz Fawa'ida.

Sistem dilengkapi mekanisme Matching Engine, Workload Balancer (kuota 3-4 diklat/orang), dan Conflict Detector untuk mencegah tumpang tindih penugasan Widyaiswara pada tanggal pelatihan yang sama.`;
    } else {
      reply = `Siap! Saya adalah Mesin Logika Backend dan Asisten Cerdas SIM-DIKLAT Puspimjemenhan Badiklat Kemhan RI TA 2027.

Saya dapat membantu Anda dalam:
1. **Katalog 43 Program Diklat**: Menampilkan deskripsi, materi kurikulum, durasi, tanggal, dan alokasi peserta.
2. **Eligibility & Syarat Peserta**: Memverifikasi kesesuaian pangkat (TNI/PNS/PPPK), pendidikan, dan usia maksimal.
3. **Direktori 28 Widyaiswara Salemba**: Pencocokan mata pelatihan (Subject Matching Matrix) dan pencegahan konflik jadwal.
4. **Kalender Pelatihan**: Menelusuri timeline pelatihan Klasikal, Blended, dan Daring (PJJ) sepanjang tahun anggaran 2027.

Silakan sampaikan pertanyaan atau parameter kualifikasi personel yang ingin Anda verifikasi.`;
    }

    return res.json({
      reply,
      source: "sim-diklat-knowledge-engine"
    });
  } catch (error: any) {
    console.error("AI Endpoint Error:", error);
    res.status(500).json({ error: "Terjadi gangguan sistem pemrosesan pesan." });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`SIM-DIKLAT Puspimjemenhan Kemhan server running on http://localhost:${port}`);
  });
}

startServer();
