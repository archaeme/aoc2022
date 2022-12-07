#include <err.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUF_SIZE 4

int main(void) {
	FILE *f = fopen("input.txt", "r");
	if (!f) {
		err(EXIT_FAILURE, "fopen");
	}

	char buffer[BUF_SIZE] = {0};
	if (fread(buffer, sizeof(char), BUF_SIZE - 1, f) != BUF_SIZE - 1) {
		err(EXIT_FAILURE, "Unable to read file");
	}

	int pos = BUF_SIZE;
	char c;
	while ((c = fgetc(f)) != EOF) {
		buffer[BUF_SIZE - 1] = c;
		for (int i = 0; i < BUF_SIZE - 1; i++) {
			for (int j = i + 1; j < BUF_SIZE; j++) {
				if (buffer[i] == buffer[j]) {
					goto next;
				}
			}
		}
		printf("[Part 1] Start-of-packet marker found at %d\n", pos);
		break;

		next:
		char tmp[BUF_SIZE - 1];
		memcpy(tmp, buffer + 1, BUF_SIZE - 1);
		memcpy(buffer, tmp, BUF_SIZE - 1);
		pos++;
	}

	return EXIT_SUCCESS;
}
