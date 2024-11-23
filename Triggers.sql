------------------------------------------------------TRIGGER EM VENDA------------------------------------------------------

CREATE TRIGGER trigger_venda
AFTER INSERT OR UPDATE OR DELETE ON Venda
FOR EACH ROW
EXECUTE PROCEDURE atualizar_venda();

CREATE OR REPLACE FUNCTION atualizar_venda()
RETURNS TRIGGER AS $$
BEGIN

-- INSERIR UMA VENDA
	IF(TG_OP = 'INSERT') THEN
	-- VERIFICAÇÃO QUANTIDADE SUFICIENTE
		IF(SELECT quantidade FROM Produto WHERE ID_Produto = NEW.produto) < NEW.quantidade THEN
			RAISE EXCEPTION 'Quantidade insuficiente no estoque para venda';
		END IF;
	-- CALCULA E ATUALIZA O PREÇO TOTAL
		UPDATE Venda 
		SET preco_total = (SELECT preco_unitario FROM Produto WHERE ID_Produto = NEW.produto)*NEW.quantidade
		WHERE ID_Venda = NEW.ID_Venda;
	-- ATUALIZA A QUANTIDADE DO PRODUTO NO ESTOQUE
		UPDATE Produto
		SET quantidade = quantidade - NEW.quantidade
		WHERE ID_produto = NEW.produto;
	-- INSERE OPERAÇÃO NO HISTÓRICO	
		INSERT INTO Historico(produto, quantidade, date_hora, tipo)
		VALUES (NEW.produto, NEW.quantidade, NEW.date_hora, 'Saída'); -- "NEW.quantidade" é a qnt vendida e retirada de Produto
-- DELETAR UMA VENDA (CASO TENHA ERRADO ALGO)
	ELSEIF(TG_OP = 'DELETE') THEN
	-- ATUALIZA A QUANTIDADE DO PRODUTO NO ESTOQUE
		UPDATE Produto
		SET quantidade = quantidade + OLD.quantidade
		WHERE ID_produto = OLD.produto;	
	-- INSERE OPERAÇÃO DE RESTAURAÇÃO NO HISTÓRICO
		INSERT INTO Historico(produto, quantidade, date_hora, tipo)
		VALUES(OLD.produto, OLD.quantidade, NOW(), 'Deleção de Venda'); -- "OLD.quantidade" é a qnt 'readicionado' à quantidade em Produto
-- ATUALIZAR UMA VENDA (CASO TENHA INSERIDO DADOS ERRADOS)
		ELSEIF(TG_OP = 'UPDATE') THEN
			DECLARE 
				aux INTEGER;
			BEGIN
				aux = NEW.quantidade - OLD.quantidade;
				IF aux > 0 AND (SELECT quantidade FROM Produto WHERE ID_produto = NEW.produto) < aux THEN
					RAISE EXCEPTION 'Quantidade insuficiente no estoque para venda';
				END IF;
			 -- DESATIVA TRIGGERS TEMPORARIAMENTE
		        SET LOCAL session_replication_role = 'replica';
		
		        -- CALCULA E ATUALIZA O PREÇO TOTAL
		        UPDATE Venda 
		        SET preco_total = (SELECT preco_unitario FROM Produto WHERE ID_Produto = NEW.produto) * NEW.quantidade
		        WHERE ID_Venda = NEW.ID_Venda;

		    -- REATIVA TRIGGERS
		        SET LOCAL session_replication_role = 'origin';
			-- ATUALIZA A QUANTIDADE DO PRODUTO NO ESTOQUE
				UPDATE Produto
				SET quantidade = quantidade - aux
				WHERE ID_Produto = NEW.produto;
			-- INSERE OPERAÇÃO DE RESTAURAÇÃO NO HISTÓRICO
					INSERT INTO Historico (produto, quantidade, date_hora, tipo)
					VALUES (NEW.produto, NEW.quantidade, NOW(), 'Atualização de Venda'); -- "NEW.quantidade" é a qnt que foi vendida corrigida
			END;
		END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------TRIGGER EM PRODUTO----------------------------------------------------

CREATE TRIGGER trigger_produto
AFTER INSERT OR UPDATE OR DELETE ON Produto
FOR EACH ROW
EXECUTE PROCEDURE atualizar_produto();

CREATE OR REPLACE FUNCTION atualizar_produto()
RETURNS TRIGGER AS $$
BEGIN

	IF TG_OP = 'INSERT' THEN
		INSERT INTO Historico(produto, quantidade, date_hora, tipo)
		VALUES(NEW.ID_produto, NEW.quantidade, NOW(), 'Entrada');
	ELSEIF TG_OP = 'DELETE' THEN
		INSERT INTO Historico(produto, quantidade, date_hora, tipo)
		VALUES(OLD.ID_produto, OLD.quantidade, NOW(), 'Deleção de Produto');
	ELSEIF TG_OP = 'UPDATE' THEN
		INSERT INTO Historico(produto, quantidade, date_hora, tipo)
		VALUES(NEW.ID_produto, NEW.quantidade, NOW(), 'Atualização de Produto');
	END IF;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;
