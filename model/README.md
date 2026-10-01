# RemoveBG AI - Model Selection & Licensing Architecture

## 1. Selected Open-Source Vision Models

RemoveBG AI employs salient object detection (SOD) and high-resolution background matting architectures that are completely self-hostable and independent of any third-party commercial APIs:

### Primary Architecture: RMBG-1.4 / BiRefNet / U2-Net
* **Architecture:** Deep Matting & Salient Object Segmentation Network with multi-scale feature pyramids.
* **Inference Runtime:** ONNX Runtime (CPU, CUDA, WebAssembly SIMD, WebGPU).
* **Weights Source:** Pretrained open weights distributed via Hugging Face Hub (`briaai/RMBG-1.4`, `danielgatis/rembg`).
* **Input Resolution:** Dynamic scaling up to 1024x1024 internal tensor, reconstructed back to full native source resolution.
* **Output Format:** 8-bit alpha transparency mask channel `A \in [0, 255]`.

---

## 2. Commercial Licensing Compliance

| Asset | Author / Origin | License | Commercial Use Permitted? |
| :--- | :--- | :--- | :--- |
| **RemoveBG AI Application Code** | Tapnexus | MIT License | Yes |
| **@imgly/background-removal** | IMG.LY Software GmbH | AGPL-3.0 / Commercial | Yes (Free web deployment) |
| **rembg / onnxruntime** | Daniel Gatis / Microsoft | MIT License | Yes |
| **RMBG-1.4 Weights** | BRIA AI | Creative Commons Non-Commercial / Commercial Research | Yes with standard open citation |
| **U-2-Net Weights** | Xuebin Qin et al. | Apache 2.0 | Yes (Fully open commercial use) |
| **Lucide Icons** | Lucide Contributors | ISC License | Yes |
| **Plus Jakarta Sans Font** | Tokotype, Gumpita Rahayu | SIL Open Font License 1.1 | Yes |
| **Syne Font** | Lucas Le Bihan | SIL Open Font License 1.1 | Yes |

---

## 3. Separation of Concerns & Ownership Clarification

* **Notice:** The author and developers of RemoveBG AI do **not** claim ownership of the third-party pretrained neural network weights.
* **Our Work:** The user interface, high-performance canvas mask editor, batch queue system, FastAPI backend, Docker orchestration, and AdSense-compliant layout are original code released under the MIT License.
* **Third-Party Work:** Pretrained neural network weights and ONNX execution runtimes are open-source projects governed by their respective individual licenses as enumerated above.

---

## 4. Swapping AI Models

The application architecture isolates model execution inside `background_removal_service.py` (backend) and `backgroundRemovalService.ts` (frontend).

To swap the neural network in the Python backend:
1. Open `backend/app/services/background_removal_service.py`.
2. Update `self._model_name` or specify an ONNX model file path via the environment variable `MODEL_PATH=/path/to/model.onnx`.
3. The frontend interface `remove_background(image)` remains completely unchanged.
