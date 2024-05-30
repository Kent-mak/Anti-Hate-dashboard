
import torch.nn as nn
from peft import LoraConfig, get_peft_model
from transformers import AutoModel, AutoTokenizer
import torch

model_name = "distilbert-base-uncased"

class RegressionModel(nn.Module):
    def __init__(self, base_model, num_labels=7):
        super(RegressionModel, self).__init__()
        self.model = base_model
        self.dropout = nn.Dropout(0.1)
        self.regressor = nn.Linear(self.model.config.hidden_size, num_labels)
        self.sigmoid = nn.Sigmoid()

    def forward(self, input_ids, attention_mask=None, labels=None):
        outputs = self.model(input_ids, attention_mask=attention_mask)
        pooled_output = outputs[0][:, 0]
        pooled_output = self.dropout(pooled_output)
        logits = self.regressor(pooled_output)
        logits = self.sigmoid(logits)

        if labels is not None:
            loss_fct = nn.MSELoss()
            loss = loss_fct(logits, labels)
            return loss, logits
        else:
            return logits
        
def getModel():
    base_model = AutoModel.from_pretrained(model_name)

    lora_config = LoraConfig(
        r=4,                      # Rank of the low-rank matrices
        lora_alpha=32,            # Scaling factor
        lora_dropout=0.1,         # Dropout probability for LoRA layers
        target_modules=["attention.q_lin", "attention.k_lin", "attention.v_lin"]  # Modules to which LoRA will be applied
    )

    model_with_lora = get_peft_model(base_model, lora_config)

    return RegressionModel(model_with_lora)

def model_eval(text):
    text = text[:350]
    model = getModel()
    model.load_state_dict(torch.load("model10%.pt", map_location=torch.device('cpu')))
    model.eval()

    tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
    input = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        logits = model(**input)

    return logits.tolist()[0]