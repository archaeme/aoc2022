#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <err.h>

// Cheating a bit by hardcoding the number of stacks
#define NUM_STACKS 9

enum state {
	STATE_DRAWING,
	STATE_INVERT,
	STATE_SKIP,
	STATE_INSTRUCTIONS,
	STATE_END,
};

struct stack {
	char items[64];
	size_t len;
};

void stack_push(struct stack *s, const char c) {
	s->items[s->len++] = c;
}

void stack_push_n(struct stack *s, const struct stack *slice) {
	memcpy(&s->items[s->len], slice->items, slice->len);
	s->len += slice->len;
}

char stack_pop(struct stack *s) {
	s->len--;
	return s->items[s->len];
}

void stack_pop_n(struct stack *s, struct stack *slice, size_t n) {
	s->len -= n;
	memcpy(slice->items, &s->items[s->len], n);
	slice->len = n;
}

void parse_drawing_line(const char *line, const size_t line_len, struct stack stacks[static NUM_STACKS]) {
	for (size_t i = 1, stack = 0; i < line_len; i += 4, stack++) {
		if (line[i] == ' ') continue;
		stack_push(&stacks[stack], line[i]);
	}
}

void parse_instruction(const char *line, struct stack stacks[static NUM_STACKS]) {
	int num_crates, source, dest;
	if (sscanf(line, "move %d from %d to %d", &num_crates, &source, &dest) != 3) return;

	source--;
	dest--;

	struct stack slice = {0};
	stack_pop_n(&stacks[source], &slice, num_crates);
	stack_push_n(&stacks[dest], &slice);
}

int main(void) {
	FILE *f = fopen("input.txt", "r");
	if (!f) {
		err(EXIT_FAILURE, "Cannot open input.txt");
	}

	char *line = NULL;
	size_t _line_len;
	struct stack stacks[NUM_STACKS] = {0};
	enum state state = STATE_DRAWING;
	while (getline(&line, &_line_len, f) != -1) {
		// Don't trust getline's output for _line_len, instead get line length with strlen
		size_t line_len = strlen(line);
		line[--line_len] = '\0';
		switch (state) {
		case STATE_DRAWING:
			if (!isdigit(line[1])) {
				parse_drawing_line(line, line_len, stacks);
				break;
			} else {
				state = STATE_INVERT;
			}
		case STATE_INVERT:
			// Invert stacks
			for (int i = 0; i < NUM_STACKS; i++) {
				struct stack tmp = {0};
				size_t stack_len = stacks[i].len;
				for (int j = 0; j < stack_len; j++) {
					stack_push(&tmp, stack_pop(&stacks[i]));
				}
				stacks[i] = tmp;
			}
			state = STATE_SKIP;
			break;
		case STATE_SKIP:
			state = STATE_INSTRUCTIONS;
			continue;
		case STATE_INSTRUCTIONS:
			if (line[0] == '\0') {
				state = STATE_END;
				continue;
			}
			parse_instruction(line, stacks);
			break;
		case STATE_END:
			break;
		}
	}
	free(line);
	if (ferror(f)) {
		err(EXIT_FAILURE, "Cannot parse input.txt");
	}

	printf("[Part 2] Crates on top of each stack: ");
	for (int i = 0; i < NUM_STACKS; i++) {
		printf("%c", stack_pop(&stacks[i]));
	}
	printf("\n");
	return EXIT_SUCCESS;
}
