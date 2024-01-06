mkf_abpath	:= $(patsubst %Makefile, %, $(abspath $(MAKEFILE_LIST)))
targets		:= proxy postman translate work

help:
	@$(foreach target,$(targets),echo "--- make _$(target) ---";)
	@echo "--- make clean ---"

_%:
	@mkdir -p bin/
	@cd $* && zip -rq ../bin/$*.zip *
	@echo "install step:"
	@echo "1.open firefox developer"
	@echo "2.Instal Add-on From File -->bin/$*.zip"

.PHONY: clean

clean:
	rm -rf bin

